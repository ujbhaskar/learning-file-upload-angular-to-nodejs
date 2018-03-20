import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Http, Response } from '@angular/http';
import { FileSelectDirective, FileUploader } from 'ng2-file-upload';
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { FileService } from "./file.service";
import { saveAs } from 'file-saver';

const URL = 'http://localhost:3000/upload';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers : [FileService]
})
export class AppComponent implements OnInit {
  uploader:FileUploader = new FileUploader({url:URL});
  attachmentList:any = [];

  ngOnInit() {
  }
  constructor(private http: Http, private el: ElementRef, private fileService:FileService) {
    this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item:any, res:any, status:any, headers:any)=>{
      this.attachmentList.push(JSON.parse(res));
    }
  }
  upload() {
      let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
      let fileCount: number = inputEl.files.length;
      console.log('inputEl : ' , inputEl.files);
      let formData = new FormData();
      if (fileCount > 0) {
        formData.append('photo', inputEl.files.item(0));
        console.log('formData : ' , formData);
        this.http.post(URL, formData).map((res:Response) => res.json()).subscribe(
          (success) => {
            console.log('success!!!');
            alert(success);
          },
          (error) =>{
            console.log('error: ' , error);
             alert(error)
        })
      }
      else{
        console.log('no files selected');
      }
  }

  download(index){
    var filename = this.attachmentList[index].uploadname;
    this.fileService.downloadFile(filename).subscribe(
      data=>{
        console.log(data);
        saveAs(data, filename);
      },
      error=>{
        console.error(error);
      }
    )
  }
}