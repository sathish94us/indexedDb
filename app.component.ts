import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'indexedDB';
  iDb: IDBDatabase;

  ngOnInit() {
    const request = indexedDB.open("Test");
    // on upgrade needed
    request.onsuccess = (event) => {
      this.iDb = event.target['result'];
      console.log(`Upgrade -- Name: ${this.iDb.name}, Version: ${this.iDb.version}`);
    }
  }

  checkIdbEmpty(): boolean {
    if (this.iDb === null || this.iDb === undefined)
      return true;
    return false;
  }

  createDb(name, value): void {
    const request = indexedDB.open(name, Number(value));

    // on upgrade needed
    request.onupgradeneeded = (event) => {
      this.iDb = event.target['result'];
      this.iDb.createObjectStore("players");
      this.iDb.createObjectStore("notes");

      console.log(`Upgrade -- Name: ${this.iDb.name}, Version: ${this.iDb.version}`);
    }

    // on success
    request.onsuccess = (event) => {
      if (this.checkIdbEmpty()) {
        if (this.checkIdbEmpty())
          return;
      }
      console.log(`Success -- Name: ${this.iDb.name}, Version: ${this.iDb.version}`);
    }

    // on error
    request.onerror = (event) => {
      console.log("error is called");
    }
  }

  addDocument(value, collectionName): void {
    if (this.checkIdbEmpty()) {
      return;
    }
    const transaction = this.iDb.transaction(collectionName, "readwrite");
    const collection = transaction.objectStore(collectionName);
    const data = {
      id: Math.random(),
      value: value
    };
    collection.add(data);
  }

  getDocument(value, collectionName): void {
    if (this.checkIdbEmpty()) {
      return;
    }
    const transaction = this.iDb.transaction(collectionName, "readonly");
    const collection = transaction.objectStore(collectionName);
    collection.getAll().onsuccess = (event) => {
      console.log("data fetched: ", event.target['result']);
    }
  }
}
