import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatIconModule, MatMenuModule, MatRippleModule } from '@angular/material';

import { FusePipesModule } from '../../pipes/pipes.module';

import { FuseMaterialColorPickerComponent } from './material-color-picker.component';

@NgModule({
    declarations: [
        FuseMaterialColorPickerComponent
    ],
    imports: [
        CommonModule,

        FlexLayoutModule,

        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatRippleModule,

        FusePipesModule
    ],
    exports: [
        FuseMaterialColorPickerComponent
    ],
})
export class FuseMaterialColorPickerModule
{
}
