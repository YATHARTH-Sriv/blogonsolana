# A Decentralised Blog App On Solana

## Getting Started

Clone The Repository and then enter the following command in the root directory:

```bash
npm install 
```

This Will Install All The Required Dependencies To Run The Frontend 

## Setting Up The Anchor Program

Go Inside the anchor folder And Run: 

```bash
cd anchor

```

Now Build The Program:

```bash
anchor build

```

Run The Local Validator in a New Terminal:

```bash
solana-test-validator

```

Now Deploy The Program:

```bash
anchor deploy --provider.cluster localnet

```

Sync The Keys So That We Do Not Run into any programid errors:

```bash
anchor keys sync

```

Now Go To Root Directory And Run The Frontend:

```bash
npm run dev

```


Now You Are All Set To Write Update And Delete Blogs Yayy!!

#### Solana For The Win
