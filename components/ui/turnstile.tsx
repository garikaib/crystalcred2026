"use client"

import { useEffect, useRef, useCallback } from "react"
import Script from "next/script"

interface TurnstileProps {
    onVerify: (token: string) => void
    onExpire?: () => void
    onError?: () => void
}

export function Turnstile({ onVerify, onExpire, onError }: TurnstileProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    // Store callbacks in refs to avoid stale closures
    const onVerifyRef = useRef(onVerify)
    const onExpireRef = useRef(onExpire)
    const onErrorRef = useRef(onError)

    useEffect(() => {
        onVerifyRef.current = onVerify
        onExpireRef.current = onExpire
        onErrorRef.current = onError
    }, [onVerify, onExpire, onError])

    // Expose callbacks to window for Turnstile
    useEffect(() => {
        (window as any).turnstileCallback = (token: string) => {
            onVerifyRef.current(token)
        };
        (window as any).turnstileExpiredCallback = () => {
            onExpireRef.current?.()
        };
        (window as any).turnstileErrorCallback = () => {
            onErrorRef.current?.()
        }

        return () => {
            delete (window as any).turnstileCallback
            delete (window as any).turnstileExpiredCallback
            delete (window as any).turnstileErrorCallback
        }
    }, [])

    return (
        <>
            <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                async
                defer
            />
            <div
                ref={containerRef}
                className="cf-turnstile"
                data-sitekey="0x4AAAAAACM4BbF045-Zf1Cw"
                data-callback="turnstileCallback"
                data-expired-callback="turnstileExpiredCallback"
                data-error-callback="turnstileErrorCallback"
                data-theme="light"
            />
        </>
    )
}
