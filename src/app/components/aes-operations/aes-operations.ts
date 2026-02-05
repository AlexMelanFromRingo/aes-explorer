import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AesService } from '../../services/aes';

@Component({
  selector: 'app-aes-operations',
  imports: [FormsModule],
  templateUrl: './aes-operations.html',
  styleUrl: './aes-operations.scss',
})
export class AesOperations {
  activeTab = signal<'subbytes' | 'shiftrows' | 'mixcolumns' | 'addroundkey' | 'keyexpansion'>('subbytes');

  // SubBytes demo
  subBytesInput = signal(0x53);
  subBytesInputText = signal('53');
  subBytesResult = computed(() => this.aes.demonstrateSubBytes(this.subBytesInput()));

  // For S-Box display
  sBoxRows = Array.from({ length: 16 }, (_, i) => i);
  sBoxCols = Array.from({ length: 16 }, (_, i) => i);

  // ShiftRows demo state
  shiftRowsState = signal<number[][]>([
    [0x63, 0xca, 0xb7, 0x04],
    [0x09, 0x53, 0xd0, 0x51],
    [0xcd, 0x60, 0xe0, 0xe7],
    [0xba, 0x70, 0xe1, 0x8c]
  ]);

  shiftRowsResult = computed(() => {
    const state = this.shiftRowsState();
    // Convert row-major to column-major for AES service
    const colMajor = [
      [state[0][0], state[1][0], state[2][0], state[3][0]],
      [state[0][1], state[1][1], state[2][1], state[3][1]],
      [state[0][2], state[1][2], state[2][2], state[3][2]],
      [state[0][3], state[1][3], state[2][3], state[3][3]]
    ];
    const shifted = this.aes.shiftRows(colMajor);
    // Convert back to row-major for display
    return [
      [shifted[0][0], shifted[1][0], shifted[2][0], shifted[3][0]],
      [shifted[0][1], shifted[1][1], shifted[2][1], shifted[3][1]],
      [shifted[0][2], shifted[1][2], shifted[2][2], shifted[3][2]],
      [shifted[0][3], shifted[1][3], shifted[2][3], shifted[3][3]]
    ];
  });

  // MixColumns demo
  mixColumnInput = signal([0xdb, 0x13, 0x53, 0x45]);
  mixColumnResult = computed(() => this.aes.demonstrateMixColumn(this.mixColumnInput()));

  // AddRoundKey demo arrays
  xorStateBytes = [0x32, 0x88, 0x31, 0xe0, 0x43, 0x5a, 0x31, 0x37, 0xf6, 0x30, 0x98, 0x07, 0xa8, 0x8d, 0xa2, 0x34];
  xorKeyBytes = [0x2b, 0x28, 0xab, 0x09, 0x7e, 0xae, 0xf7, 0xcf, 0x15, 0xd2, 0x15, 0x4f, 0x16, 0xa6, 0x88, 0x3c];

  // Key Expansion demo
  demoKey = [0x2b, 0x7e, 0x15, 0x16, 0x28, 0xae, 0xd2, 0xa6, 0xab, 0xf7, 0x15, 0x88, 0x09, 0xcf, 0x4f, 0x3c];
  expandedKeyDemo = computed(() => this.aes.expandKey(this.demoKey));
  selectedRound = signal(0);

  // Round constants for display
  rconValues = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

  constructor(public aes: AesService) {}

  setTab(tab: 'subbytes' | 'shiftrows' | 'mixcolumns' | 'addroundkey' | 'keyexpansion') {
    this.activeTab.set(tab);
  }

  setSelectedRound(round: number) {
    this.selectedRound.set(round);
  }

  getWordHex(word: number[]): string {
    return word.map(b => this.toHex(b)).join(' ');
  }

  getRoundKeyWords(round: number): number[][] {
    const expanded = this.expandedKeyDemo();
    return expanded.slice(round * 4, round * 4 + 4);
  }

  updateSubBytesInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.subBytesInputText.set(value);
    const num = parseInt(value, 16);
    if (!isNaN(num) && num >= 0 && num <= 255) {
      this.subBytesInput.set(num);
    }
  }

  formatSubBytesInput() {
    this.subBytesInputText.set(this.toHex(this.subBytesInput()));
  }

  toHex(n: number): string {
    return n.toString(16).padStart(2, '0').toUpperCase();
  }

  getSBoxValue(row: number, col: number): string {
    return this.toHex(this.aes.sBox[row * 16 + col]);
  }

  isHighlightedSBox(row: number, col: number): boolean {
    const result = this.subBytesResult();
    return result.row === row && result.col === col;
  }
}
