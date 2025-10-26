// Lightweight reportWebVitals implementation.
// If `web-vitals` is available, it will be used when a callback is provided.
// If not, this function is a harmless no-op so callers can safely call it.
const reportWebVitals = (onPerfEntry) => {
	if (onPerfEntry && typeof onPerfEntry === 'function') {
		// Try to dynamically import web-vitals; if it's not installed, just warn and continue.
		import('web-vitals')
			.then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
				try {
					getCLS(onPerfEntry);
					getFID(onPerfEntry);
					getFCP(onPerfEntry);
					getLCP(onPerfEntry);
					getTTFB(onPerfEntry);
				} catch (err) {
					// If web-vitals API changes or callbacks throw, avoid crashing the app
					console.warn('Error while reporting web vitals:', err);
				}
			})
			.catch((err) => {
				// If web-vitals isn't installed, that's fine — just log a helpful message.
				// This prevents the app from crashing if the import fails.
				// Keeping this as a non-fatal warning to avoid forcing a dependency.
				// You can `npm install web-vitals` if you want real vitals reporting.
				console.warn('web-vitals package not available; skipping performance reporting.', err);
			});
	}
};

export default reportWebVitals;
