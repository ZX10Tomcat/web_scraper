import { Component, Input } from '@angular/core';
import { FormControl} from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpClient , HttpParams} from '@angular/common/http';
import { headersToString } from 'selenium-webdriver/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable()
export class AppComponent {
     private data: any;  
     title = 'FIA F1 Webscraper';
     url = new FormControl("http://fia.com");
     headers : Array<string> = [];

     displayedColumns = {};
     results = {};

    constructor(private http: HttpClient) { 
       //this.loadData();
    }
          

    public getresult(event) {
       this.loadData();
    } 

    private loadData(): void {
       // Initialize Params Object
          
        let data = this.http.get('http://localhost:3000/api', 
        {params: new HttpParams().set('url', this.url.value)})  
        .subscribe((res: Response) => {            
            this.data = res;
            if (this.data.length < 1) {
                alert("Cannot find any results in this URL ")

            }
         
            let i = 0;
            for(let event of this.data) {               
               this.headers.push(event.header);
               
               let columns = [];
               Object.keys(event.results[0]).forEach(function (key) {
                   columns.push(key);
               });
               this.results[i] = event.results;
               this.displayedColumns[i] = columns;
               i++;
               /*
               for (let result of event.results) {

                  Object.keys(result).forEach(function (key) {
                     
                     console.log("key:" + key , "result:" + result[key] );
                  });
               }
               */

            }           
        });  
     
}  
}

