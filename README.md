## Table of Contents
- [Quickstart](#quickstart)
- [List of Commands](#list-of-commands)
  - [Monorepo Root (/)](#monorepo-root)
  - [Mobile (/web/yesplz-mobile)](#mobile-webyesplz-mobile)
  - [Desktop (/web/yesplz-desktop)](#desktop-webyesplz-desktop)
- [Deployment](#deployment)
- [Update Visual Filter SVG](#update-visual-filter-svg)
- [Docker Settings](#docker-settings)
- [Tips](#tips)

# Quickstart
```console
$ yarn reset
$ cd web/yesplz-mobile
$ yarn start
```

# List of Commands
## Monorepo Root (/)
| Scripts                | Descriptions           |
| ------------------     |:-----------------------|
| yarn reset             | install dependencies across all packages. Important to do after added new dependencies in each packages |
| yarn build             | Build all `/web` packages |
| yarn storybook         | Run storybook for all packages (port: 9009) |
| yarn test              | Run tests of all packages |

## Mobile (/web/yesplz-mobile)

| Scripts                | Descriptions           |
| ------------------     |:-----------------------|
| yarn start             | Serve development server in specific port |
| yarn build             | Build project |
| yarn analyze           | Run bundle size analyzer. Must build the project first. |
| yarn test              | Run tests. add `--watch` for auto reload |

## Desktop (/web/yesplz-desktop)

| Scripts                | Descriptions           |
| ------------------     |:-----------------------|
| yarn start             | Serve development server in specific port |
| yarn build             | Build project |
| yarn analyze           | Run bundle size analyzer. Must build the project first. |
| yarn test              | Run tests. add `--watch` for auto reload |


# Deployment
1. ssh to yesplz server.
2. Go to `~/yesplz_front/` directory.
3. `git pull` to get last code updates or change branch if necessary.
4. Run `docker-compose stop` to stop running containers (use `sudo` for non root users).
5. Run `docker-compose up -d --build` to start building the images (use `sudo` for non root users). To start container without building the image, run `docker-compose up -d`.

# Update Visual Filter SVG
1. Go to `/packages/core-web/vf_svg`.
2. You can edit the svg parts. Note: The filters button won’t be merged, since it was moved to React component for reusability purpose.
3. To merge assets, run `python merge_svg_assets.py` (or with using `python3`) to produce `vf_bundle.svg` file (vf with horizontal thumbnails) and `python merge_svg_thumb_vertical_assets.py` to produce `vf_bundle_thumb_vertical.svg` (vf with vertical thumbnails).

# Docker Settings
- To update docker script, go to `/docker/` directory and modify `Dockerfile`. Docker compose file is located on root directory.
- There are environment variable configurations for mobile web (`/docker/.env`) and desktop web (`/docker/.env.desktop`). (PRODUCTION)
- You can also modify the nginx configuration at `/docker/nginx.conf` to change routing / redirect rules.

# Tips
Add these extension in your **chrome** browser to help with debugging:
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)

For vscode users, please install [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) addons and add this to vscode user settings:
```
"eslint.options": {
    "configFile": ".eslintrc"
}
```
.env.local file in web\yesplz-* directory  will override default .env
