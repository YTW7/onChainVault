use anchor_lang::{prelude::*, system_program::{Transfer, transfer}};

declare_id!("9wrXefJaF6bxaiDhR8EMPjZvCk6rUWboudLMxiopWhnB");

#[program]
pub mod anchor_vault {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.initialize(&ctx.bumps);
    }

    pub fn deposit(ctx: Context<Payment>, amount: u64) -> Result<()> {
        ctx.accounts.deposit(amount);
    }


}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        mut
    )]
    pub user: Signer<'info>,

    #[account(
        init,
        payer=user,
        space = VaultState::INIT_SPACE,
        seeds = [b"state", user.key().as_ref()],
        bump
    )]
    pub vault_state: Account<'info, VaultState>,

    #[account(
        mut,
        seeds = [b"vault", vault_state.key().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,


    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct Payment<'info>(
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"vault", vault_state.key().as_ref()],
        bump = vaul_state.state_bump;
    )]
    pub vault: SystemAccount<'info>,

    #[account(
        seeds = [b"vault", user.key().as_ref()],
        bump = vaul_state.state_bump;
    )]
    pub vaul_state: Account<'info, VaultState>,

    pub system_program: Program<'info, System>,
)

impl<'info>Payment<'info>{
    pub fn deposit(&mut self, amount: u64) -> Result<()> {

        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = Transfer{
            from: self.user.to_account_info(),
            to: self.vault.to_account_info()
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        transfer(cpi_ctx, amount);

    }

    pub fn withdraw(&mut self, amount: u64) -> Result<()> {

        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = Transfer{
            from: self.vault.to_account_info(),
            to: self.user.to_account_info()
        };

        let seeds=&[
            b"vault",
            self.vaul_state.to_account_info().key.as_ref(),
            &[self.vaul_state.vault_bump],
        ];

        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        transfer(cpi_ctx, amount);

    }
}

impl<'info>Initialize<'info>{
    pub fn initialize(&mut self, bumps: &InitializeBumps) -> Result<()> {

        let rent_exempt = Rent::get()?.minimum_balance(self.vault.to_account_info().data_len());

        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = Transfer{
            from: self.user.to_account_info(),
            to: self.vault.to_account_info()
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        transfer(cpi_ctx, rent_exempt);

        self.vault_state.vault_bump= bumps.vault;
        self.vault_state.state_bump= bumps.vault_state;

        Ok(())
    }
}


#[account]
// #[derive(InitSpace)]
pub struct VaultState {
    pub vault_bump: u8,
    pub state_bump: u8,
}

impl Space for VaultState{
    const INIT_SPACE: usize = 
    8 //for anchor discriminator
     + 
     1*2; //space vault bump takes
}