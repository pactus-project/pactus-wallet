import { initWasm } from "@trustwallet/wallet-core";
import { Wallet } from "../wallet";

describe("Wallet", () => {
    let wallet: Wallet;
    beforeEach(async () => {
        const core = await initWasm();
        wallet = Wallet.restore(core, "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon cactus", "");
    });

    it("should create a new address", async () => {
        let addr1 = wallet.newEd25519Address("");
        let addr2 = wallet.newEd25519Address("");
        let addr3 = wallet.newEd25519Address("");

        expect(addr1).toBe("pc1rcx9x55nfme5juwdgxd2ksjdcmhvmvkrygmxpa3");
        expect(addr2).toBe("pc1r7aynw9urvh66ktr3fte2gskjjnxzruflkgde94");
        expect(addr3).toBe("pc1ruumtknmwr6ns32rkezfph38tawwx7gesmykk4g");
    });
})
