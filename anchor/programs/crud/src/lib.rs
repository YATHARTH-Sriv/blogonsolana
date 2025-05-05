#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("9kbP7YvPKV7zxSu3S8MA8yCMQaE3uRDnkbkPHqBG4VVs");

#[program]
pub mod crud {
    use super::*;

    pub fn create_journal(ctx:Context<JournalInitialize>,
                          title:String,
                          content:String,
                          publickeyofowner:Pubkey  
    )->Result<()>{
        msg!("Journal Entry Created");
        msg!("Title: {}", title);
        msg!("Content: {}", content);
        let journal_entry= &mut ctx.accounts.journal_entry;
        journal_entry.owner = publickeyofowner;
        journal_entry.title = title;
        journal_entry.content = content;
        Ok(())
    }

    pub fn update_journal(ctx:Context<JournalUpdate>,_title:String,content:String)->Result<()>{
        msg!(" Update the message {}",content);
        let journal_entry= &mut ctx.accounts.journal_entry;
        journal_entry.content=content; 
        Ok(())

    }

    pub fn delete_journal(_ctx:Context<JournalDelete>,_title:String)->Result<()>{
           Ok(())
    }

   
}

#[account]
#[derive(InitSpace)]
pub struct CreateJournal{
    pub owner: Pubkey,
    #[max_len(32)]
    pub title: String,
    #[max_len(280)]
    pub content: String
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct JournalInitialize<'info>{
    #[account(mut)]
    pub signer:Signer<'info>,
    #[account(
        init,
        payer = signer,
        space = 8+ CreateJournal::INIT_SPACE,
        seeds = [title.as_bytes(), signer.key().as_ref()], 
        bump
    )]
    pub journal_entry: Account<'info, CreateJournal>,
    pub system_program: Program<'info, System>,
}



#[derive(Accounts)]
#[instruction(title:String)]
pub struct JournalUpdate<'info>{
    #[account(mut)]
    pub signer:Signer<'info>,
    #[account(
        mut,
        realloc = 8+ CreateJournal::INIT_SPACE,
        realloc::payer=signer,
        realloc::zero=true,
        seeds = [title.as_bytes(), signer.key().as_ref()], 
        bump
    )]
    pub journal_entry: Account<'info, CreateJournal>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct JournalDelete<'info>{
    #[account(mut)]
    pub signer:Signer<'info>,
    #[account(
        mut,
        close = signer,
        seeds = [title.as_bytes(), signer.key().as_ref()], 
        bump
    )]
    pub journal_entry: Account<'info, CreateJournal>,
    pub system_program: Program<'info, System>,
}