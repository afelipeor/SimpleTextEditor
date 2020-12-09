import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { AboutTheEditorComponent } from './about-the-editor/about-the-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    ContextMenuComponent,
    AboutTheEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
