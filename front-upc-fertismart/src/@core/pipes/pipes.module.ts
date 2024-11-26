import { NgModule } from '@angular/core';
import { FilterPipe } from '@core/pipes/filter.pipe';
import { InitialsPipe } from '@core/pipes/initials.pipe';
import { SafePipe } from '@core/pipes/safe.pipe';
import { StripHtmlPipe } from '@core/pipes/stripHtml.pipe';
import { AreaFormatPipe } from './area-format.pipe';
import { CurrencyPeruPipe } from './currency-peru.pipe';

@NgModule({
  declarations: [
    InitialsPipe,
    FilterPipe, 
    StripHtmlPipe, 
    SafePipe, 
    AreaFormatPipe,
    CurrencyPeruPipe
  ],
  imports: [],
  exports: [
    InitialsPipe,
    FilterPipe, 
    StripHtmlPipe, 
    SafePipe, 
    AreaFormatPipe,
    CurrencyPeruPipe
  ]
})
export class CorePipesModule {}
