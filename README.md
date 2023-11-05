# HappyDodo API

My own anime metadata API. Database schema can be found in the `anime_offline_dataset` repository (private).

## Endpoints

- `/animes/:id`: returns the anime if found
- `/animes/:id/mappings`: returns provider mappings
- `/animes/:id/related`: returns mappings for related animes
- `/feed`: returns 50 random animes
- `/feed/random`: returns a single random anime
- `/feed/search/:searchQuery`: returns up to 25 matches for searchQuery

