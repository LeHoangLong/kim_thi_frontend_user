let isRelease = false
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
} else {
    // production code
    isRelease = true
}

let _BACKEND_URL = "http://kim_thi_backend_1/backend/enduser"
if (typeof window !== 'undefined') {
    _BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL_FROM_BROWSER
} else {
    _BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL_FROM_SERVER
}

console.log('_BACKEND_URL')
console.log(_BACKEND_URL)
console.log(process.env.NEXT_PUBLIC_BACKEND_URL_FROM_BROWSER)
console.log(process.env.NEXT_PUBLIC_BACKEND_URL_FROM_SERVER)
export const BACKEND_URL = _BACKEND_URL;

export const FILESERVER_URL = process.env.NEXT_PUBLIC_FILESERVER_URL_FROM_BROWSER;