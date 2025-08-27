import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { aptosClient } from "@/utils";
import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import { Button } from "../ui/button";

export function RotateKey() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const {
    account,
    network,
    signTransaction,
  } = useWallet();

  const handleRotateKey = async () => {
    if (!account || !signTransaction) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please connect your wallet first",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create a new key pair for rotation
      const newPrivateKey = new Ed25519PrivateKey("0xd4511f12a7f47d69af0980a8a0fa354e718ba93d37f6d0f5799ae01aed3943c3");
      const newAccount = Account.fromPrivateKey({ privateKey: newPrivateKey });
      console.log(`New auth key: ${newAccount.accountAddress.toString()}`);

      // Get account info to get the sequence number
      const accountInfo = await aptosClient(network).account.getAccountInfo({
        accountAddress: account.address,
      });

      console.log(`Current account sequence number: ${accountInfo.sequence_number}`);
      console.log(`Current account: ${account.address}`);

      console.log("=== Key Rotation Details ===");
      console.log("Current account:", account.address);
      console.log("New account:", newAccount.accountAddress.toString());
      console.log("Current auth key:", accountInfo.authentication_key);
      console.log("New public key:", newAccount.publicKey.toString());


      try {
        // Create transaction payload in the correct InputTransactionData format
        // const transactionPayload = {
        //   data: {
        //     function: "0x1::account::rotate_authentication_key_call",
        //     typeArguments: [],
        //     functionArguments: [
        //       newAccount.accountAddress.toString()
        //     ],
        //   },
        // };

        const transactionPayload = {
          data: {
            function: "0x1::account::rotate_authentication_key_call",
            typeArguments: [],
            functionArguments: [
              Array.from(newAccount.publicKey.toUint8Array())
            ],
          },
        };

        console.log("=== Transaction Payload ===");
        console.log("Payload:", JSON.stringify(transactionPayload, null, 2));

        const signedTransaction = await signTransaction({
          transactionOrPayload: transactionPayload as any,
          asFeePayer: false,
        });

        console.log("=== Signed Transaction Details ===");
        console.log("Authenticator:", signedTransaction.authenticator);
        console.log("Raw transaction length:", signedTransaction.rawTransaction.length);
        console.log("Signed transaction received from wallet");

        // For now, we'll show the signed transaction details
        // The actual submission would require proper API configuration
        console.log("=== Transaction Ready for Submission ===");
        console.log("You now have a signed transaction that can be submitted to the network");
        console.log("Raw transaction bytes:", signedTransaction.rawTransaction);
        console.log("Authenticator:", signedTransaction.authenticator);

        toast({
          title: "Success",
          description: `Transaction signed successfully! Ready for submission.`,
        });

      } catch (signError) {
        console.error("Error during signing:", signError);
        toast({
          variant: "destructive",
          title: "Signing Error",
          description: (signError as Error).message || "Failed to sign transaction",
        });
        throw signError;
      }

      // Invalidate queries to refresh account data
      queryClient.invalidateQueries({
        queryKey: ["account-info", account.address],
      });

    } catch (error: any) {
      console.error("Error preparing key rotation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to prepare key rotation",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRotateKeyFromPublicKey = async () => {
    if (!account || !signTransaction) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please connect your wallet first",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create a new key pair for rotation
      const newPrivateKey = new Ed25519PrivateKey("0xd4511f12a7f47d69af0980a8a0fa354e718ba93d37f6d0f5799ae01aed3943c3");
      const newAccount = Account.fromPrivateKey({ privateKey: newPrivateKey });
      console.log(`New auth key: ${newAccount.accountAddress.toString()}`);

      // Get account info to get the sequence number
      const accountInfo = await aptosClient(network).account.getAccountInfo({
        accountAddress: account.address,
      });

      console.log(`Current account sequence number: ${accountInfo.sequence_number}`);
      console.log(`Current account: ${account.address}`);

      console.log("=== Key Rotation Details (From Public Key) ===");
      console.log("Current account:", account.address);
      console.log("New account:", newAccount.accountAddress.toString());
      console.log("Current auth key:", accountInfo.authentication_key);
      console.log("New public key:", newAccount.publicKey.toString());

      try {
        // Create transaction payload for rotate_authentication_key_from_public_key
        // ED25519_SCHEME = 0
        const transactionPayload = {
          data: {
            function: "0x1::account::rotate_authentication_key_from_public_key",
            typeArguments: [],
            functionArguments: [
              0, // scheme: u8 (ED25519_SCHEME = 0)
              Array.from(newAccount.publicKey.toUint8Array()) // new_public_key_bytes: vector<u8>
            ],
          },
        };

        console.log("=== Transaction Payload (From Public Key) ===");
        console.log("Payload:", JSON.stringify(transactionPayload, null, 2));

        const signedTransaction = await signTransaction({
          transactionOrPayload: transactionPayload as any,
          asFeePayer: false,
        });

        console.log("=== Signed Transaction Details (From Public Key) ===");
        console.log("Authenticator:", signedTransaction.authenticator);
        console.log("Raw transaction length:", signedTransaction.rawTransaction.length);
        console.log("Signed transaction received from wallet");

        // For now, we'll show the signed transaction details
        // The actual submission would require proper API configuration
        console.log("=== Transaction Ready for Submission (From Public Key) ===");
        console.log("You now have a signed transaction that can be submitted to the network");
        console.log("Raw transaction bytes:", signedTransaction.rawTransaction);
        console.log("Authenticator:", signedTransaction.authenticator);

        toast({
          title: "Success",
          description: `Transaction signed successfully! (From Public Key method)`,
        });

      } catch (signError) {
        console.error("Error during signing:", signError);
        toast({
          variant: "destructive",
          title: "Signing Error",
          description: (signError as Error).message || "Failed to sign transaction",
        });
        throw signError;
      }

      // Invalidate queries to refresh account data
      queryClient.invalidateQueries({
        queryKey: ["account-info", account.address],
      });

    } catch (error: any) {
      console.error("Error preparing key rotation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to prepare key rotation",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>RotateKey</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-4">
          <div className="flex gap-4">
            <Button
              variant='destructive'
              disabled={!account || isLoading}
              onClick={handleRotateKey}
            >
              {isLoading ? "Loading..." : "handleRotateKey"}
            </Button>

            <Button
              variant='destructive'
              disabled={!account || isLoading}
              onClick={handleRotateKeyFromPublicKey}
            >
              {isLoading ? "Loading..." : "handleRotateKeyFromPublicKey"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}