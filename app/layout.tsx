import "./globals.css";
import { Public_Sans } from "next/font/google";
import { ActiveLink } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import Image from "next/image";
import { Web3Providers } from "@/components/Web3Providers";
import { ConnectWallet } from "@/components/ConnectWallet";
import { WalletProvider } from "@/components/WalletContext";

const publicSans = Public_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>MetaMask AI</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <meta
          name="description"
          content="MetaMask AI is a tool that allows you to interact with the MetaMask blockchain. See source code and deploy your own at https://github.com/AugmentedMode/MetaMask-Hackathon-2025!"
        />
        <meta property="og:title" content="MetaMask AI" />
        <meta
          property="og:description"
          content="MetaMask AI is a tool that allows you to interact with the MetaMask blockchain. See source code and deploy your own at https://github.com/AugmentedMode/MetaMask-Hackathon-2025!"
        />
        <meta property="og:image" content="/images/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MetaMask AI" />
        <meta
          name="twitter:description"
          content="MetaMask AI is a tool that allows you to interact with the MetaMask blockchain. See source code and deploy your own at https://github.com/AugmentedMode/MetaMask-Hackathon-2025!"
        />
        <meta name="twitter:image" content="/images/og-image.png" />
      </head>
      <body className={publicSans.className}>
        <NuqsAdapter>
          <WalletProvider>
            <Web3Providers>
              <div className="bg-secondary grid grid-rows-[auto,1fr] h-[100dvh]">
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-2 p-4">
                  <div className="flex gap-4 flex-col md:flex-row md:items-center">
                    <Image src="/images/MetaMask-logo-black.svg" alt="Logo" width={97} height={48} />
                  </div>

                  <div className="flex justify-center items-center">
                    <Button asChild variant="link" size="default">
                      <a
                        href="https://github.com/AugmentedMode/MetaMask-Hackathon-2025"
                        target="_blank"

                      >
                        <span className="text-base font-semibold">Learn More</span>
                      </a>
                    </Button>
                  </div>

                  <div className="flex justify-center items-center">
                    <Button asChild variant="link" size="default">
                      <a
                        href="https://github.com/AugmentedMode/MetaMask-Hackathon-2025"
                        target="_blank"

                      >
                        <span className="text-base font-semibold">Github</span>
                      </a>
                    </Button>
                  </div>

                  <div className="flex justify-center items-center">
                    <ConnectWallet />
                  </div>

                </div>
                <div className="bg-background mx-4 relative grid rounded-t-2xl border border-input border-b-0">
                  <div className="absolute inset-0">{children}</div>
                </div>
              </div>
              <Toaster />
            </Web3Providers>
          </WalletProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
