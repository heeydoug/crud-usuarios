import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  userName: string | null;

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('username');
  }

}
