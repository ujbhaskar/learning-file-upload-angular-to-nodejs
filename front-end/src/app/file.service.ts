import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders } from "@angular/common/http";
// import { HttpHeaders } from "@angular/common/http/src/headers";
import 'rxjs/Rx';
import { Observable } from 'rxjs';
 
@Injectable()
export class FileService{

    constructor(private http: HttpClient){

    }

    downloadFile(file:String){
        var body = {filename:file};
        return this.http.post('http://localhost:3000/download',body,{
            responseType: 'blob',
            headers: new HttpHeaders().append('Content-Type','application/json')
        })
    }

}