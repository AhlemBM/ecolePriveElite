import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  actualDate!:Date;

  constructor() { }

  ngOnInit() {
    this.actualDate= new Date();

  }

}
