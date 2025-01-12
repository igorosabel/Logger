import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  EntryInterface,
  TagEntriesResult,
  TagInterface,
} from '@interfaces/interfaces';
import Entry from '@model/entry.model';
import Tag from '@model/tag.model';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import CryptoService from '@services/crypto.service';
import DataShareService from '@services/data-share.service';
import OneEntryComponent from '@shared/components/one-entry/one-entry.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  imports: [
    OneEntryComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
})
export default class TagListComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private dss: DataShareService = inject(DataShareService);
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private crypto: CryptoService = inject(CryptoService);

  loading: WritableSignal<boolean> = signal<boolean>(true);
  idTag: number = -1;
  tag: Tag = new Tag();
  entryList: Entry[] = [];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.idTag = params['id'];
      this.loadEntries();
    });
  }

  async loadEntries(): Promise<void> {
    try {
      const response: TagEntriesResult = await firstValueFrom(
        this.as.getTagEntries(this.idTag)
      );

      if (response.status === 'ok') {
        const encryptedTag: TagInterface = response.tag;
        const decryptedTag: TagInterface = await this.crypto.decryptTag(
          encryptedTag
        );
        this.tag = this.cms.getTag(decryptedTag);
        const encryptedEntries: EntryInterface[] = response.list;
        const decryptedEntries: EntryInterface[] =
          await this.crypto.decryptEntries(encryptedEntries);
        this.entryList = this.cms.getEntries(decryptedEntries);
      }
    } catch (error) {
      console.error('Error al cargar las entradas:', error);
    } finally {
      this.loading.set(false);
    }
  }

  goBack(): void {
    const whereTo: string = this.dss.getGlobal('where');
    switch (whereTo) {
      case 'home':
        {
          this.router.navigate(['/home']);
        }
        break;
      case 'entry':
        {
          const entryId: number = this.dss.getGlobal('entryId');
          this.router.navigate(['/entry', entryId]);
        }
        break;
      case 'tags':
        {
          this.router.navigate(['/tags']);
        }
        break;
    }
  }
}
