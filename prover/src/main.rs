use ark_ec::{AffineRepr, CurveGroup};
use ark_ed_on_bn254::{EdwardsAffine, EdwardsProjective, Fq};
use ark_ff::{BigInteger, PrimeField};
use ark_serialize::{CanonicalDeserialize, Compress, Validate};
use ethabi::{decode, encode, ethereum_types::U256, ParamType, Token};
use rand_chacha::{rand_core::SeedableRng, ChaChaRng};
use std::fs::{read_to_string, write};
use zshuffle::{
    build_cs::prove_shuffle,
    gen_params::{gen_shuffle_prover_params, params::refresh_prover_params_public_key},
    MaskedCard,
};

#[inline]
fn parse_tokens_to_point(t_x: &Token, t_y: &Token) -> EdwardsProjective {
    let mut b_x = [0u8; 32];
    let mut b_y = [0u8; 32];
    t_x.clone().into_uint().unwrap().to_big_endian(&mut b_x);
    t_y.clone().into_uint().unwrap().to_big_endian(&mut b_y);

    let f_x = Fq::from_be_bytes_mod_order(&b_x);
    let f_y = Fq::from_be_bytes_mod_order(&b_y);

    EdwardsAffine::new(f_x, f_y).into()
}

#[inline]
fn parse_point_to_tokens<F: PrimeField, G: CurveGroup<BaseField = F>>(p: G) -> (Token, Token) {
    let affine = G::Affine::from(p);
    let (cx, cy) = affine.xy().unwrap();

    let x_bytes = cx.into_bigint().to_bytes_be();
    let y_bytes = cy.into_bigint().to_bytes_be();

    let x = U256::from_big_endian(&x_bytes);
    let y = U256::from_big_endian(&y_bytes);

    (Token::Uint(x), Token::Uint(y))
}

fn main() {
    // read input & output & proof env
    let input_path = std::env::var("INPUT").expect("env INPUT missing");
    let output_path = std::env::var("OUTPUT").expect("env OUTPUT missing");
    let proof_path = std::env::var("PROOF").expect("env PROOF missing");

    let input_string = read_to_string(input_path).expect("Unable to read file");
    let input_string2 = input_string.trim_start_matches("0x");
    let input_bytes = hex::decode(input_string2).expect("Unable decode hex inputs");

    let mut input_tokens = decode(
        &[
            ParamType::Uint(256),
            ParamType::Array(Box::new(ParamType::Uint(256))),
        ],
        &input_bytes,
    )
    .expect("Unable decode inputs");
    let input_decks_token = input_tokens.pop().unwrap();
    let input_joint_token = input_tokens.pop().unwrap();

    let mut joint_bytes = [0u8; 32];
    input_joint_token
        .into_uint()
        .unwrap()
        .to_big_endian(&mut joint_bytes);
    let joint_pk = EdwardsProjective::deserialize_with_mode(
        joint_bytes.as_slice(),
        Compress::Yes,
        Validate::Yes,
    )
    .expect("Joint PK invalid");

    let mut cards = vec![];
    let input_decks = input_decks_token.into_array().unwrap();
    assert_eq!(input_decks.len() % 4, 0);
    for item in input_decks.chunks(4) {
        // e2, e1
        let e2 = parse_tokens_to_point(&item[0], &item[1]);
        let e1 = parse_tokens_to_point(&item[2], &item[3]);
        cards.push(MaskedCard { e1, e2 });
    }
    let n_cards = cards.len();

    let mut params = gen_shuffle_prover_params(n_cards).unwrap();
    let pkc = refresh_prover_params_public_key(&mut params, &joint_pk).unwrap();

    let mut prng = ChaChaRng::from_entropy();
    let (proof, new_cards) = prove_shuffle(&mut prng, &joint_pk, &cards, &params).unwrap();

    // serialize new_cards & proof to file
    let mut pkc_token = vec![];
    for p in pkc {
        let (x, y) = parse_point_to_tokens(p);

        pkc_token.push(x);
        pkc_token.push(y);
    }

    let mut new_cards_token = vec![];
    for nc in new_cards {
        let (x1, y1) = parse_point_to_tokens(nc.e1);
        let (x2, y2) = parse_point_to_tokens(nc.e2);

        // e2, e1
        new_cards_token.push(x2);
        new_cards_token.push(y2);
        new_cards_token.push(x1);
        new_cards_token.push(y1);
    }

    let output_bytes = encode(&[Token::Array(pkc_token), Token::Array(new_cards_token)]);
    let output_string = format!("0x{}", hex::encode(output_bytes));
    write(output_path, output_string).expect("Unable to create output file");

    let proof_bytes = proof.to_bytes_be();
    let proof_string = format!("0x{}", hex::encode(proof_bytes));
    write(proof_path, proof_string).expect("Unable to create proof file");
}
