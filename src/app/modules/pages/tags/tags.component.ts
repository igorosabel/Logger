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
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { TagInterface, TagsResult } from '@interfaces/interfaces';
import Tag from '@model/tag.model';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import CryptoService from '@services/crypto.service';
import DataShareService from '@services/data-share.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
})
export default class TagsComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private dss: DataShareService = inject(DataShareService);
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private crypto: CryptoService = inject(CryptoService);

  loading: WritableSignal<boolean> = signal<boolean>(true);
  username: string = '';
  tagList: Tag[] = [];

  ngOnInit(): void {
    this.dss.setGlobal('where', 'tags');
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.username = params['username'];
      this.loadTags();
    });
  }

  async loadTags(): Promise<void> {
    try {
      const response: TagsResult = await firstValueFrom(this.as.getTags());

      if (response.status === 'ok') {
        const encryptedTags: TagInterface[] = response.list;
        const decryptedTags: TagInterface[] = await this.crypto.decryptTags(
          encryptedTags
        );
        this.tagList = this.cms.getTags(decryptedTags);
      }
    } catch (error) {
      console.error('Error al cargar los tags:', error);
    } finally {
      this.loading.set(false);
    }
  }
}
