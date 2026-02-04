import { Component, signal } from '@angular/core';

interface Mode {
  id: string;
  name: string;
  fullName: string;
  security: 'low' | 'medium' | 'high';
  parallel: boolean;
  authenticated: boolean;
  description: string;
  pros: string[];
  cons: string[];
  useCase: string;
}

@Component({
  selector: 'app-aes-modes',
  imports: [],
  templateUrl: './aes-modes.html',
  styleUrl: './aes-modes.scss',
})
export class AesModes {
  selectedMode = signal<string>('cbc');

  modes: Mode[] = [
    {
      id: 'ecb',
      name: 'ECB',
      fullName: 'Electronic Codebook',
      security: 'low',
      parallel: true,
      authenticated: false,
      description: 'The simplest mode. Each block is encrypted independently with the same key. Identical plaintext blocks produce identical ciphertext blocks.',
      pros: [
        'Simple to implement',
        'Parallelizable encryption and decryption',
        'No IV required',
        'Random access to blocks'
      ],
      cons: [
        'Patterns in plaintext visible in ciphertext',
        'Not semantically secure',
        'Vulnerable to block replay attacks',
        'Should NOT be used for encrypting data'
      ],
      useCase: 'Only for encrypting single random blocks (like encryption keys). Never for general data.'
    },
    {
      id: 'cbc',
      name: 'CBC',
      fullName: 'Cipher Block Chaining',
      security: 'medium',
      parallel: false,
      authenticated: false,
      description: 'Each plaintext block is XORed with the previous ciphertext block before encryption. The first block uses an Initialization Vector (IV).',
      pros: [
        'Hides patterns in plaintext',
        'Widely supported and understood',
        'Decryption is parallelizable',
        'Good for file encryption'
      ],
      cons: [
        'Encryption is sequential (not parallelizable)',
        'Requires padding (PKCS#7)',
        'Vulnerable to padding oracle attacks',
        'No built-in authentication'
      ],
      useCase: 'File encryption, disk encryption, legacy systems. Should be combined with HMAC for authentication.'
    },
    {
      id: 'ctr',
      name: 'CTR',
      fullName: 'Counter Mode',
      security: 'medium',
      parallel: true,
      authenticated: false,
      description: 'Turns block cipher into stream cipher. Encrypts sequential counter values and XORs the result with plaintext.',
      pros: [
        'Fully parallelizable',
        'No padding needed',
        'Random access to any block',
        'Pre-computation possible'
      ],
      cons: [
        'Counter must never repeat with same key',
        'No built-in authentication',
        'Bit-flipping attacks possible',
        'Nonce management critical'
      ],
      useCase: 'High-performance applications, network protocols, when random access is needed.'
    },
    {
      id: 'gcm',
      name: 'GCM',
      fullName: 'Galois/Counter Mode',
      security: 'high',
      parallel: true,
      authenticated: true,
      description: 'Combines CTR mode encryption with Galois field multiplication for authentication. Provides both confidentiality and integrity.',
      pros: [
        'Authenticated encryption (AEAD)',
        'Fully parallelizable',
        'Hardware acceleration (PCLMULQDQ)',
        'Industry standard (TLS 1.3)'
      ],
      cons: [
        'Nonce reuse is catastrophic',
        'Authentication tag adds overhead',
        'More complex implementation',
        'Limited to ~64GB per key/nonce'
      ],
      useCase: 'TLS, HTTPS, API encryption, any scenario requiring authenticated encryption. Recommended default choice.'
    },
    {
      id: 'xts',
      name: 'XTS',
      fullName: 'XEX-based Tweaked-codebook with Ciphertext Stealing',
      security: 'high',
      parallel: true,
      authenticated: false,
      description: 'Designed specifically for disk encryption. Uses two keys and a tweak value based on sector number.',
      pros: [
        'Designed for storage encryption',
        'No ciphertext expansion',
        'Parallelizable',
        'Sector-level random access'
      ],
      cons: [
        'Requires two keys (256-bit total for AES-128)',
        'No authentication',
        'Complex implementation',
        'Not suitable for network protocols'
      ],
      useCase: 'Full disk encryption (BitLocker, FileVault, LUKS), SSD encryption.'
    }
  ];

  getSelectedMode(): Mode {
    return this.modes.find(m => m.id === this.selectedMode()) || this.modes[0];
  }

  selectMode(id: string) {
    this.selectedMode.set(id);
  }

  getSecurityClass(security: string): string {
    switch (security) {
      case 'low': return 'badge badge--gold';
      case 'medium': return 'badge badge--green';
      case 'high': return 'badge badge--purple';
      default: return 'badge';
    }
  }
}
