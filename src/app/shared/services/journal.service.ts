import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface JournalNote {
  id: string;
  tradeId?: string;
  title: string;
  content: string;
  emotion: string;
  mistakes: string[];
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private readonly STORAGE_KEY = 'tradeflow_journal';
  private notesSubject = new BehaviorSubject<JournalNote[]>(this.loadFromLocalStorage());
  public notes$ = this.notesSubject.asObservable();

  constructor() {}

  private loadFromLocalStorage(): JournalNote[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveToLocalStorage(notes: JournalNote[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
    this.notesSubject.next(notes);
  }

  getNotes(): Observable<JournalNote[]> {
    return this.notes$;
  }

  addNote(note: JournalNote): Observable<JournalNote> {
    const notes = this.notesSubject.value;
    note.id = Math.random().toString(36).substr(2, 9);
    note.date = note.date || new Date().toISOString();
    const updated = [...notes, note];
    this.saveToLocalStorage(updated);
    return of(note).pipe(delay(200));
  }

  updateNote(id: string, updatedData: Partial<JournalNote>): Observable<JournalNote> {
    const notes = this.notesSubject.value;
    const index = notes.findIndex(n => n.id === id);
    if (index > -1) {
      const updatedNote = { ...notes[index], ...updatedData };
      notes[index] = updatedNote;
      this.saveToLocalStorage([...notes]);
      return of(updatedNote).pipe(delay(200));
    }
    throw new Error('Note not found');
  }

  deleteNote(id: string): Observable<boolean> {
    const notes = this.notesSubject.value;
    const filtered = notes.filter(n => n.id !== id);
    this.saveToLocalStorage(filtered);
    return of(true).pipe(delay(200));
  }

  clearAll(): void {
    this.saveToLocalStorage([]);
  }
}
