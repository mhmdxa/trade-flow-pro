import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { JournalNote } from '../../../shared/services/journal.service';
import { TradeService, Trade } from '../../../shared/services/trade.service';
import { I18nService } from '../../../core/services/i18n.service';
import { Observable } from 'rxjs';
import { LucideAngularModule, Plus, Edit2, Check } from 'lucide-angular';

@Component({
  selector: 'app-journal-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './journal-modal.component.html'
})
export class JournalModalComponent implements OnInit {
  @Input() editNote: JournalNote | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<JournalNote>();

  journalForm: FormGroup;
  trades$: Observable<Trade[]>;
  
  readonly icons = { Plus, Edit2, Check };
  
  emotions = ['Fear', 'Greed', 'Calm', 'Discipline', 'Revenge'];
  mistakesOptions = ['Entered early', 'Exited early', 'Violate plan', 'Large lot'];

  constructor(
    private fb: FormBuilder, 
    private tradeService: TradeService,
    public i18n: I18nService
  ) {
    this.trades$ = this.tradeService.getTrades();
    this.journalForm = this.fb.group({
      title: ['', Validators.required],
      tradeId: [''],
      content: ['', Validators.required],
      emotion: ['Calm', Validators.required],
      mistakes: [[]]
    });
  }

  ngOnInit(): void {
    if (this.editNote) {
      this.journalForm.patchValue({
        ...this.editNote
      });
    }
  }

  toggleMistake(mistake: string, event: any): void {
    const currentMistakes: string[] = this.journalForm.get('mistakes')?.value || [];
    if (event.target.checked) {
      this.journalForm.patchValue({ mistakes: [...currentMistakes, mistake] });
    } else {
      this.journalForm.patchValue({ mistakes: currentMistakes.filter(m => m !== mistake) });
    }
  }

  hasMistake(mistake: string): boolean {
    return (this.journalForm.get('mistakes')?.value || []).includes(mistake);
  }

  onSubmit(): void {
    if (this.journalForm.valid) {
      this.save.emit(this.journalForm.value as JournalNote);
    }
  }

  onClose(): void {
    this.close.emit();
  }

  t(key: string): string { return this.i18n.t(key); }
}
