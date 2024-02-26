//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use num_derive::FromPrimitive;
use thiserror::Error;

#[derive(Clone, Debug, Eq, Error, FromPrimitive, PartialEq)]
pub enum AcmeCounterError {
    /// 0 (0x0) - Invalid System Program
    #[error("Invalid System Program")]
    InvalidSystemProgram,
    /// 1 (0x1) - Error deserializing account
    #[error("Error deserializing account")]
    DeserializationError,
    /// 2 (0x2) - Error serializing account
    #[error("Error serializing account")]
    SerializationError,
}

impl solana_program::program_error::PrintProgramError for AcmeCounterError {
    fn print<E>(&self) {
        solana_program::msg!(&self.to_string());
    }
}
