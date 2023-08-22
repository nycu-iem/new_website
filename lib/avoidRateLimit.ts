let lastFetch = new Date()

export async function avoidRateLimit() {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        let sinceLastFetch = new Date().getTime() - lastFetch.getTime()
        if (sinceLastFetch < 350) {
            await sleepMs()
        }
        lastFetch = new Date()
    }
}

const sleepMs = async (delay = 300) => {
    await new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}