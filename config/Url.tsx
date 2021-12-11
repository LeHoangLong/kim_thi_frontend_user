let isRelease = false
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
} else {
    // production code
    isRelease = true
}

let _BACKEND_URL = "http://kim_thi_backend_1/backend/enduser"
if (isRelease) {
    _BACKEND_URL = "https://kim-thi-backend-rfqj7mlw2q-as.a.run.app/backend/enduser"
} else if (process.browser) {
    _BACKEND_URL = "http://localhost/backend/enduser"
}

export const BACKEND_URL = _BACKEND_URL;

let _FILESERVER_URL = "http://localhost/backend" 
if (isRelease) {
    _FILESERVER_URL = 'https://storage.googleapis.com/kim-thi'
}
export const FILESERVER_URL = _FILESERVER_URL;