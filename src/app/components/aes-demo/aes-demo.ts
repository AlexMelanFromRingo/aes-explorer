import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AesService, AesStep, AesEncryptionResult } from '../../services/aes';

@Component({
  selector: 'app-aes-demo',
  imports: [FormsModule],
  templateUrl: './aes-demo.html',
  styleUrl: './aes-demo.scss',
})
export class AesDemo {
  plaintext = signal('Hello, AES!');
  key = signal('MySecretKey12345');
  inputMode = signal<'text' | 'hex'>('text');

  encryptionResult = signal<AesEncryptionResult | null>(null);
  currentStepIndex = signal(0);
  isAnimating = signal(false);

  currentStep = computed(() => {
    const result = this.encryptionResult();
    const index = this.currentStepIndex();
    if (result && result.steps[index]) {
      return result.steps[index];
    }
    return null;
  });

  totalSteps = computed(() => {
    const result = this.encryptionResult();
    return result ? result.steps.length : 0;
  });

  progressPercent = computed(() => {
    const total = this.totalSteps();
    const current = this.currentStepIndex();
    return total > 0 ? ((current + 1) / total) * 100 : 0;
  });

  constructor(public aes: AesService) {}

  encrypt() {
    const plaintextBytes = this.inputMode() === 'text'
      ? this.aes.stringToBytes(this.plaintext())
      : this.aes.hexToBytes(this.plaintext());

    const keyBytes = this.inputMode() === 'text'
      ? this.aes.stringToBytes(this.key())
      : this.aes.hexToBytes(this.key());

    const result = this.aes.encrypt(plaintextBytes, keyBytes);
    this.encryptionResult.set(result);
    this.currentStepIndex.set(0);
  }

  nextStep() {
    const total = this.totalSteps();
    const current = this.currentStepIndex();
    if (current < total - 1) {
      this.currentStepIndex.set(current + 1);
    }
  }

  prevStep() {
    const current = this.currentStepIndex();
    if (current > 0) {
      this.currentStepIndex.set(current - 1);
    }
  }

  goToStep(index: number) {
    this.currentStepIndex.set(index);
  }

  async autoPlay() {
    if (this.isAnimating()) return;

    this.isAnimating.set(true);
    this.currentStepIndex.set(0);

    const total = this.totalSteps();
    for (let i = 0; i < total; i++) {
      if (!this.isAnimating()) break;
      this.currentStepIndex.set(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    this.isAnimating.set(false);
  }

  stopAnimation() {
    this.isAnimating.set(false);
  }

  toHex(n: number): string {
    return n.toString(16).padStart(2, '0');
  }

  bytesToHexString(bytes: number[]): string {
    return bytes.map(b => this.toHex(b)).join(' ');
  }

  getStateForDisplay(state: number[][]): number[][] {
    // Convert from column-major (AES internal) to row-major (display)
    const rows: number[][] = [[], [], [], []];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        rows[row].push(state[col][row]);
      }
    }
    return rows;
  }

  getStepColor(stepName: string): string {
    if (stepName.includes('SubBytes')) return 'primary';
    if (stepName.includes('ShiftRows')) return 'accent';
    if (stepName.includes('MixColumns')) return 'purple';
    if (stepName.includes('AddRoundKey')) return 'gold';
    return 'primary';
  }
}
