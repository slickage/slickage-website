# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.2.16 AS base
WORKDIR /app/
# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile
# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production
# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
# [optional] tests & build
ENV NODE_ENV=production

RUN bun run build

RUN addgroup --system --gid 1001 nextjs

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app/public ./public/
COPY --from=prerelease /app/src/ ./src/
COPY --from=prerelease --chown=bun:nextjs /app/.next/ ./.next/
COPY --from=prerelease /app/package.json ./
COPY --from=prerelease /app/next.config.ts ./
COPY --from=prerelease /app/drizzle.config.ts ./
# run the app
USER bun
EXPOSE 3000/tcp
CMD  ["bun", "run", "start"]

# FROM oven/bun:1.2.16
# WORKDIR /src/
# COPY package.json bun.lock ./
# RUN bun install --frozen-lockfile
# COPY . .
# RUN bun run build