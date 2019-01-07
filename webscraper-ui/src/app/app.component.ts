import { Component, Input } from '@angular/core';
import { FormControl} from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable()
export class AppComponent {
     private data: any;  
     title = 'FIA F1 Webscraper';
     url = new FormControl("http://fia.com")

     displayedColumns: string[] = ['header'];

    constructor(private http: HttpClient) { 
       //this.loadData();
    }
          

    public getresult(event) {
       this.loadData();
    } 

    private loadData(): void {          
        let data = this.http.get('http://localhost:3000/api')  
        .subscribe((res: Response) => { 
            this.data = res;
            console.log(res);
        });  
     
}  
}

