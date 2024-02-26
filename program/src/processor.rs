use borsh::BorshDeserialize;
use solana_program::{
    account_info::AccountInfo, entrypoint::ProgramResult, msg, program::invoke, pubkey::Pubkey,
    rent::Rent, system_instruction, system_program, sysvar::Sysvar,
};

use crate::error::CounterError;
use crate::instruction::accounts::CreateAccounts;
use crate::instruction::{CreateArgs, CounterInstruction};
use crate::state::{Key, Counter, MyData};

pub fn process_instruction<'a>(
    _program_id: &Pubkey,
    accounts: &'a [AccountInfo<'a>],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction: CounterInstruction =
        CounterInstruction::try_from_slice(instruction_data)?;
    match instruction {
        CounterInstruction::Create(args) => {
            msg!("Instruction: Create");
            create(accounts, args)
        }
    }
}

fn create<'a>(accounts: &'a [AccountInfo<'a>], args: CreateArgs) -> ProgramResult {
    // Accounts.
    let ctx = CreateAccounts::context(accounts)?;
    let rent = Rent::get()?;

    // Guards.
    if *ctx.accounts.system_program.key != system_program::id() {
        return Err(CounterError::InvalidSystemProgram.into());
    }

    // Fetch the space and minimum lamports required for rent exemption.
    let space: usize = Counter::LEN;
    let lamports: u64 = rent.minimum_balance(space);

    // CPI to the System Program.
    invoke(
        &system_instruction::create_account(
            ctx.accounts.payer.key,
            ctx.accounts.address.key,
            lamports,
            space as u64,
            &crate::id(),
        ),
        &[
            ctx.accounts.payer.clone(),
            ctx.accounts.address.clone(),
            ctx.accounts.system_program.clone(),
        ],
    )?;

    let counter = Counter {
        key: Key::Counter,
        authority: *ctx.accounts.authority.key,
        value: 0,
    };

    counter.save(ctx.accounts.address)
}
