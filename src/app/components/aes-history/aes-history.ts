import { Component } from '@angular/core';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  highlight?: boolean;
}

interface RfcDocument {
  number: string;
  title: string;
  year: string;
  description: string;
}

@Component({
  selector: 'app-aes-history',
  imports: [],
  templateUrl: './aes-history.html',
  styleUrl: './aes-history.scss',
})
export class AesHistory {
  timeline: TimelineEvent[] = [
    {
      year: '1997',
      title: 'NIST Announces AES Competition',
      description: 'The U.S. National Institute of Standards and Technology announces a public competition to select a new encryption standard to replace the aging DES.'
    },
    {
      year: '1998',
      title: '15 Candidates Submitted',
      description: 'Fifteen candidate algorithms from around the world are submitted for evaluation, including Rijndael, Serpent, Twofish, RC6, and MARS.'
    },
    {
      year: '1999',
      title: 'Five Finalists Selected',
      description: 'After extensive analysis, NIST narrows the field to five finalists: Rijndael, Serpent, Twofish, RC6, and MARS.'
    },
    {
      year: '2000',
      title: 'Rijndael Selected as AES',
      description: 'On October 2, NIST announces Rijndael as the winner. The algorithm was designed by Belgian cryptographers Joan Daemen and Vincent Rijmen.',
      highlight: true
    },
    {
      year: '2001',
      title: 'FIPS 197 Published',
      description: 'AES is officially published as Federal Information Processing Standard (FIPS) 197, becoming the new U.S. government encryption standard.',
      highlight: true
    },
    {
      year: '2003',
      title: 'NSA Approves for Classified',
      description: 'The NSA approves AES for encrypting classified information up to TOP SECRET level when used in NSA-approved systems.'
    },
    {
      year: '2005',
      title: 'AES-NI Announced',
      description: 'Intel announces AES-NI (AES New Instructions), hardware acceleration for AES operations that would dramatically improve performance.'
    },
    {
      year: '2010',
      title: 'AES-NI Deployed',
      description: 'Intel Westmere processors ship with AES-NI support, enabling billions of AES operations per second.'
    },
    {
      year: 'Today',
      title: 'Universal Standard',
      description: 'AES is used in virtually all modern encryption applications: HTTPS, WiFi, file encryption, VPNs, and countless other systems.',
      highlight: true
    }
  ];

  rfcDocuments: RfcDocument[] = [
    {
      number: 'FIPS 197',
      title: 'Advanced Encryption Standard (AES)',
      year: '2001',
      description: 'The official NIST specification defining the AES algorithm, including the mathematical foundations, key expansion, and all transformations.'
    },
    {
      number: 'RFC 3565',
      title: 'Use of AES-CBC in CMS',
      year: '2003',
      description: 'Defines the use of AES with Cipher Block Chaining in the Cryptographic Message Syntax standard.'
    },
    {
      number: 'RFC 3602',
      title: 'AES-CBC Cipher for IPsec ESP',
      year: '2003',
      description: 'Specifies the use of AES-CBC as an encryption transform within the context of IPsec Encapsulating Security Payload.'
    },
    {
      number: 'RFC 4106',
      title: 'AES-GCM for IPsec ESP',
      year: '2005',
      description: 'Defines the use of AES in Galois/Counter Mode (GCM) with IPsec ESP, providing authenticated encryption.'
    },
    {
      number: 'RFC 5116',
      title: 'AEAD Interface for AES',
      year: '2008',
      description: 'Defines an interface and algorithm for authenticated encryption with associated data (AEAD).'
    },
    {
      number: 'RFC 5288',
      title: 'AES-GCM Cipher Suites for TLS',
      year: '2008',
      description: 'Specifies the use of AES-GCM cipher suites for TLS, now the preferred cipher for HTTPS connections.'
    },
    {
      number: 'RFC 6655',
      title: 'AES-CCM Cipher Suites for TLS',
      year: '2012',
      description: 'Specifies AES Counter with CBC-MAC (CCM) cipher suites for TLS, an alternative authenticated encryption mode.'
    },
    {
      number: 'SP 800-38A-F',
      title: 'Modes of Operation',
      year: '2001-2016',
      description: 'NIST Special Publications defining block cipher modes: ECB, CBC, CFB, OFB, CTR, CCM, GCM, XTS, and key wrapping.'
    }
  ];

  designPrinciples = [
    {
      title: 'Wide Trail Strategy',
      description: 'A design strategy that maximizes the number of active S-boxes across rounds, ensuring rapid diffusion and resistance to differential and linear cryptanalysis.'
    },
    {
      title: 'Substitution-Permutation Network',
      description: 'AES uses an SPN structure where substitution (S-Box) provides confusion and permutation (ShiftRows, MixColumns) provides diffusion.'
    },
    {
      title: 'Galois Field Arithmetic',
      description: 'All operations are defined over GF(2^8) with the irreducible polynomial x^8 + x^4 + x^3 + x + 1, enabling efficient hardware and software implementations.'
    },
    {
      title: 'Key Schedule Security',
      description: 'The key expansion algorithm ensures that round keys are cryptographically derived from the cipher key, preventing related-key attacks.'
    }
  ];
}
