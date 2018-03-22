import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Http, Headers, Response } from "@angular/http";
// import { HttpHeaders } from "@angular/common/http/src/headers";
import 'rxjs/Rx';
import { Observable } from 'rxjs';
 
@Injectable()
export class FileService{

    headers:Headers = new Headers({'Content-Type': 'application/json'});
    constructor(private httpClient: HttpClient, private http: Http){

    }
    getFiles(){
        return this.http.get('http://localhost:3000/file/files', {headers: this.headers})
        .map((response: Response) => response.json())
        .catch((error: Response) => {
            console.log(error);
            return Observable.throw(error.json());
        });
    }

    // downloadFile(file:String){
    //     console.log('file: ' , file);
    //     var body = {filename:file};
    //     return this.httpClient.get('http://localhost:3000/file/download',{
    //         responseType: 'blob',
    //         headers: new HttpHeaders().append('Content-Type','application/json')
    //     })
    // }

    //Working below**********
    // downloadFile(file:String){
    //     console.log('file: ' , file);
    //     var body = {filename:file};
    //     return this.httpClient.post('http://localhost:3000/file/download',body,{
    //         responseType: 'blob',
    //         headers: new HttpHeaders().append('Content-Type','application/json')
    //     })
    // }
    uploadFile(form:any){
        console.log(form);
        return this.http.post('http://localhost:3000/file/upload', form, {headers: this.headers})
        .map((response: Response) => response.json())
        .catch((error: Response) => {
            console.log(error);
            return Observable.throw(error.json());
        });
    }

    downloadFile(file:String){
        console.log('file: ' , file);
        var body = {filename:file};
        return this.httpClient.get('http://localhost:3000/file/image/'+file,{
            responseType: 'blob',
            headers: new HttpHeaders().append('Content-Type','application/json')
        })
    }
    deleteFile(file: String){
        console.log('file: ' , file);
        return this.http.delete('http://localhost:3000/file/delete/'+file, {headers: this.headers})
        .map((response: Response) => response.json())
        .catch((error: Response) => {
            console.log(error);
            return Observable.throw(error.json());
        });
    }

}