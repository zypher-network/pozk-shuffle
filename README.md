# pozk-shuffle
Universal shuffle mining prover

## Serialize (ABI encode/decode)
- Inputs (bytes)
```
"uint256"

uint256, // join_pk (aggregate_keys)
```

- Publics (bytes)
```
"uint256[]"

uint256[], //deck serialize to u256 array
```

- Proof (bytes)
```
"uint256[], uint256[], bytes"

uint256[], // new_deck serialize to uint256 array
uint256[], // pkc
bytes,     // proof
```

## e.g. Hex (20 cards)
```
inputs: 0xac20f35ff1b6dcba684d5828999f680d9faa2f2f43db5bcab8ef0c8b8c2f0215
publics: 0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000005004a3c91ecd103572cdd04e55cc59e9302807019f70edbb36ce23fabe9361b0781515c7127288a90944e6ead717d7c3f5933a75a66880968763c3aa6604ec9e552b8cfd91b905cae31d41e7dedf4a927ee3bc429aad7e344d59d2810d82876c322aaa6c24a758209e90aced1f10277b762a7c1115dbc0e16ac276fc2c671a861f18c64f5e7181cb8cabe548a0f2ca6944c74b44d0ddd2954bbe2dd86257bb59f516e00292078ff0450be524ef8cb502cf31242507456c60ef51c2d094f944fa762b8cfd91b905cae31d41e7dedf4a927ee3bc429aad7e344d59d2810d82876c322aaa6c24a758209e90aced1f10277b762a7c1115dbc0e16ac276fc2c671a861f06f906eb8705b13ad61015981a805df796db8d40fce0f8654e85e511f32f9bd9131940a6a214f32ea2c33bbe5b16ecf29fa0765958ab755b206561a91d80d6c82b8cfd91b905cae31d41e7dedf4a927ee3bc429aad7e344d59d2810d82876c322aaa6c24a758209e90aced1f10277b762a7c1115dbc0e16ac276fc2c671a861f248f6ef0e958c93eb37460d9eadd00ee0d43afadb00f8fe0ae4e8aac55b93d662915b98a60a37d0d62c5d264d6cb2eff8125679a415febacfcfd2a16f027c23e2b8cfd91b905cae31d41e7dedf4a927ee3bc429aad7e344d59d2810d82876c322aaa6c24a758209e90aced1f10277b762a7c1115dbc0e16ac276fc2c671a861f19e34ef7d798520e9aedaa68248a360d51180b7fc4f9197b334e44c47a7529c823b3a1ead16792fb3b60fe2337ec738a41deec1759c4df3c4a3ac87997282bd52b8cfd91b905cae31d41e7dedf4a927ee3bc429aad7e344d59d2810d82876c322aaa6c24a758209e90aced1f10277b762a7c1115dbc0e16ac276fc2c671a861f1378ef9c6ab9dfc8965fd733ba01dbca33783d70cbfe7a19260525ff0a1eb23a2f5964de885185168b36bb3965fff8e147de3be1bd9165bd076139750238f83c2b8cfd91b905cae31d41e7dedf4a927ee3bc429aad7e344d59d2810d82876c322aaa6c24a758209e90aced1f10277b762a7c1115dbc0e16ac276fc2c671a861f03c4dada90a709aa0cdbebb3eb2e7093225dcf3d79f07c3d3fcbbce540e79e301c3f9725b42204216e128b750557b38caaa7047b4d23938825c4b71f4b956af62b8cfd91b905cae31d41e7dedf4a927ee3bc429aad7e344d59d2810d82876c322aaa6c24a758209e90aced1f10277b762a7c1115dbc0e16ac276fc2c671a861f1ebac9188bfe70d44600b11569d6e5d27eb486ce2b79bf226dc8637b999e9c6a28696ad73bb7e8f3e841ecdcde12180cc4a3976195d13dcab988150c6b86a5ba2b8cfd91b905cae31d41e7dedf4a927ee3bc429aad7e344d59d2810d82876c322aaa6c24a758209e90aced1f10277b762a7c1115dbc0e16ac276fc2c671a861f1d32d994bf4e5638d7f6c93ca9721746bb69d6a673e98e064645076ae5ea6f02098754887d1cc16f3b90d6511943343d3e776d1f3ec765eb08bbfa3e45f225302b8cfd91b905cae31d41e7dedf4a927ee3bc429aad7e344d59d2810d82876c322aaa6c24a758209e90aced1f10277b762a7c1115dbc0e16ac276fc2c671a861f23036d4ff88417d4444a1ebc3ec4d399722ff3eff7955ee1ac93ddf1ac4da10a1efbe4953700184f6b404dff5dcaeb032fee339f8cb366483e926319318611902b8cfd91b905cae31d41e7dedf4a927ee3bc429aad7e344d59d2810d82876c322aaa6c24a758209e90aced1f10277b762a7c1115dbc0e16ac276fc2c671a861f143d579871aef2e79218c01c872766a1ab6e6caea611cc97d035306c70f8632603ee20ca52a78ec15ecf42f7bbc4806b49a79cf7082d88d020d5ac2766eb5f6a2b8cfd91b905cae31d41e7dedf4a927ee3bc429aad7e344d59d2810d82876c322aaa6c24a758209e90aced1f10277b762a7c1115dbc0e16ac276fc2c671a861f1cd502b0921e1f77942c1402cfbfa5d2e1c60a8e343f4356840342789b533c6c124664b31be3c8556d85c59a4731bcb3e69f60b5d739c9c6a63099fc4c0379db2b8cfd91b905cae31d41e7dedf4a927ee3bc429aad7e344d59d2810d82876c322aaa6c24a758209e90aced1f10277b762a7c1115dbc0e16ac276fc2c671a861f0d62e4c2f6be91dc3dab7b7e994661e85b2881cbb1e2785d96017ea852ab7bed09d88f4bff277bae6fb48d355a3eae8ad3046bb273a9849abad49c47923eaa652b8cfd91b905cae31d41e7dedf4a927ee3bc429aad7e344d59d2810d82876c322aaa6c24a758209e90aced1f10277b762a7c1115dbc0e16ac276fc2c671a861f15b3718736c912ce332cfc4edd81cd53af7e5a83f573c9c1244e6df2756277222c469b1350030b2db934f8d78bb43f5f8f44042c790b077b76f32911cdf502712b8cfd91b905cae31d41e7dedf4a927ee3bc429aad7e344d59d2810d82876c322aaa6c24a758209e90aced1f10277b762a7c1115dbc0e16ac276fc2c671a861f22fd382d087173ab5fbb305efb9f7a64036c633f36897380407ac23a3634b0762c81f75a8a429b7dce26863bf96dd221081c3f26ba665f047de76b4bd3295bce2b8cfd91b905cae31d41e7dedf4a927ee3bc429aad7e344d59d2810d82876c322aaa6c24a758209e90aced1f10277b762a7c1115dbc0e16ac276fc2c671a861f14bc3ac4082c034d71b2ec37ecd3e9198c5d2bc7e8b7d49711eff7897fc76d331084874c4849d83ed2ba5cd9250eacc545b4f46a2a2cbbb3091ee39872798bd22b8cfd91b905cae31d41e7dedf4a927ee3bc429aad7e344d59d2810d82876c322aaa6c24a758209e90aced1f10277b762a7c1115dbc0e16ac276fc2c671a861f1fa5873b82d98696f0d84d4e7ed0371eca5ae949464aeb6b65f6d4be6fd0bbd02bb02c5f0b98836f081d55b2518147d6e5a10814bd2937b86b89451bce45528f2b8cfd91b905cae31d41e7dedf4a927ee3bc429aad7e344d59d2810d82876c322aaa6c24a758209e90aced1f10277b762a7c1115dbc0e16ac276fc2c671a861f2e7148f2ce1b558012948a4f3dbaae6fedc2a7698759961dc1e14b02afb6833a270722b17ea9849fa5771c72fbd00419f114634fff7f50b2be9f720ca6352a062b8cfd91b905cae31d41e7dedf4a927ee3bc429aad7e344d59d2810d82876c322aaa6c24a758209e90aced1f10277b762a7c1115dbc0e16ac276fc2c671a861f2b6c5dad54ec9d3ff608cf6bad2f30a36cf8ed738c87ab9ab6d72cbfaa223f461c66796116419e7a02a865b5c6008fbc78c36a6ce438c9d00b04b1073c5e0f162b8cfd91b905cae31d41e7dedf4a927ee3bc429aad7e344d59d2810d82876c322aaa6c24a758209e90aced1f10277b762a7c1115dbc0e16ac276fc2c671a861f0b4995fc5243340f090f06ed117f3bcef6863d6f82956303b8cc1e913d5fc1e907d98dcd55d0acfafe80a44f7b3b0e31dee0b967bec95105ed979489961094132b8cfd91b905cae31d41e7dedf4a927ee3bc429aad7e344d59d2810d82876c322aaa6c24a758209e90aced1f10277b762a7c1115dbc0e16ac276fc2c671a861f
```

## License

This project is licensed under [GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).
