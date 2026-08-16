# Views

These should be client-side components that handle most of a page's functionality.  Putting them in `views` means they are client side (not pages) but they in charge of the whole view (not standard components).  Mostly this boils down to needing to manage state (standard or synced to a DO) that doesn't really work with a server-side page component. 