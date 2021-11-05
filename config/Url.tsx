let _BACKEND_URL = "http://kim_thi_backend_1/backend/enduser"
if (process.browser) {
    _BACKEND_URL = "http://localhost/backend/enduser"
}

export const BACKEND_URL = _BACKEND_URL;
export const FILESERVER_URL = "http://localhost/backend";