import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Http, Headers, Response } from "@angular/http";
// import { HttpHeaders } from "@angular/common/http/src/headers";
import 'rxjs/Rx';
import { Observable } from 'rxjs';
 
@Injectable()
export class FileService{

    constructor(private http: HttpClient){

    }
    getFiles(){
         return this.http.get('http://localhost:3000/file/files',{
            headers: new HttpHeaders().append('Content-Type','application/json')
        })
        .map((response: Response) =>response.json())
        .catch((error: Response) => {
            return Observable.throw(error.json());
        });
    }

    downloadFile(file:String){
        var body = {filename:file};
        return this.http.post('http://localhost:3000/download',body,{
            responseType: 'blob',
            headers: new HttpHeaders().append('Content-Type','application/json')
        })
    }

}