import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, Edit2, Trash2, Heart, AlertCircle, Calendar, Zap } from 'lucide-angular';
import { JournalService, JournalNote } from '../../shared/services/journal.service';
import { TradeService, Trade } from '../../shared/services/trade.service';
import { JournalModalComponent } from './journal-modal/journal-modal.component';
import { I18nService } from '../../core/services/i18n.service';
import { Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, JournalModalComponent],
  templateUrl: './journal.component.html'
})
export class JournalComponent implements OnInit {
  notes$: Observable<{note: JournalNote, trade?: Trade}[]>;
  stats$: Observable<any>;
  
  showModal = false;
  noteToEdit: JournalNote | null = null;
  
  readonly icons = { Plus, Edit2, Trash2, Heart, AlertCircle, Calendar, Zap };

  constructor(
    private journalService: JournalService,
    private tradeService: TradeService,
    public i18n: I18nService
  ) {
    this.notes$ = combineLatest([
      this.journalService.getNotes(),
      this.tradeService.getTrades()
    ]).pipe(
      map(([notes, trades]) => {
        return notes.map(n => ({
          note: n,
          trade: trades.find(t => t.id === n.tradeId)
        })).sort((a, b) => new Date(b.note.date).getTime() - new Date(a.note.date).getTime());
      })
    );

    this.stats$ = this.journalService.getNotes().pipe(
      map(notes => {
        const thisWeek = notes.filter(n => (Date.now() - new Date(n.date).getTime()) < 604800000).length;
        
        let emotionCounts: Record<string, number> = {};
        notes.forEach(n => { emotionCounts[n.emotion] = (emotionCounts[n.emotion] || 0) + 1; });
        const mostFreqEmotion = Object.keys(emotionCounts).reduce((a, b) => emotionCounts[a] > emotionCounts[b] ? a : b, 'None');

        let mistakeCounts: Record<string, number> = {};
        notes.forEach(n => n.mistakes.forEach(m => mistakeCounts[m] = (mistakeCounts[m] || 0) + 1));
        const mostFreqMistake = Object.keys(mistakeCounts).reduce((a, b) => mistakeCounts[a] > mistakeCounts[b] ? a : b, 'None');

        return { thisWeek, mostFreqEmotion, mostFreqMistake };
      })
    );
  }

  ngOnInit(): void {}
  
  t(key: string): string { return this.i18n.t(key); }

  openModal(note: JournalNote | null = null): void {
    this.noteToEdit = note;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.noteToEdit = null;
  }

  saveNote(note: JournalNote): void {
    if (this.noteToEdit) {
      this.journalService.updateNote(this.noteToEdit.id, note).subscribe();
    } else {
      this.journalService.addNote(note).subscribe();
    }
    this.closeModal();
  }

  deleteNote(id: string): void {
    if (confirm(this.t('common.confirm'))) {
      this.journalService.deleteNote(id).subscribe();
    }
  }
}
