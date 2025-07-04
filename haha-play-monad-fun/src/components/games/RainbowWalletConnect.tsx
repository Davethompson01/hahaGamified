
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'

const RainbowWalletConnect = () => {
  const { address, isConnected } = useAccount()

  useEffect(() => {
    if (isConnected && address) {
      // Wallet connected - cache for 3 days
      const connectionData = {
        address: address,
        timestamp: Date.now(),
        expiresAt: Date.now() + (3 * 24 * 60 * 60 * 1000) // 3 days
      }
      localStorage.setItem('walletConnection', JSON.stringify(connectionData))
      localStorage.setItem('userWalletAddress', address)
      
      // Trigger wallet change event
      window.dispatchEvent(new CustomEvent('walletChanged'))
      console.log('Wallet connected and cached:', address)
    } else {
      // Wallet disconnected - clear ALL cached data immediately
      console.log('Wallet disconnected - clearing all cached data')
      
      // Clear wallet connection data
      localStorage.removeItem('walletConnection')
      localStorage.removeItem('userWalletAddress')
      
      // Clear all wallet-specific game data
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('gameStats_') || 
            key.startsWith('tokensEarned_') || 
            key.startsWith('questProgress_')) {
          localStorage.removeItem(key);
          console.log('Cleared cached data:', key);
        }
      });
      
      // Trigger wallet change event to update all components
      window.dispatchEvent(new CustomEvent('walletChanged'))
    }
  }, [isConnected, address])

  // Check and clean expired cached connections on component mount
  useEffect(() => {
    const cachedConnection = localStorage.getItem('walletConnection')
    if (cachedConnection) {
      try {
        const parsed = JSON.parse(cachedConnection)
        if (Date.now() > parsed.expiresAt) {
          console.log('Cached connection expired - cleaning up')
          localStorage.removeItem('walletConnection')
          localStorage.removeItem('userWalletAddress')
          
          // Clear expired wallet data
          const keys = Object.keys(localStorage);
          keys.forEach(key => {
            if (key.startsWith('gameStats_') || 
                key.startsWith('tokensEarned_') || 
                key.startsWith('questProgress_')) {
              localStorage.removeItem(key);
            }
          });
        }
      } catch (error) {
        console.error('Error parsing cached connection:', error)
        localStorage.removeItem('walletConnection')
      }
    }
  }, [])

  return (
    <div className="text-center">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading'
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated')

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-3 mx-auto backdrop-blur-sm border border-white/20"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                      </svg>
                      Connect Wallet - Your Gaming Identity
                    </button>
                  )
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg backdrop-blur-sm border border-white/20"
                    >
                      Wrong network
                    </button>
                  )
                }

                return (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={openChainModal}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg backdrop-blur-sm border border-white/20"
                      type="button"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 20,
                            height: 20,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 20, height: 20 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </button>

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg backdrop-blur-sm border border-white/20"
                    >
                      <div className="text-sm">
                        <div className="font-mono">
                          {account.displayName}
                        </div>
                        <div className="text-white/90 text-xs">
                          {account.displayBalance}
                        </div>
                      </div>
                    </button>
                  </div>
                )
              })()}
            </div>
          )
        }}
      </ConnectButton.Custom>
    </div>
  )
}

export default RainbowWalletConnect
