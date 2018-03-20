spice
=====

Add a little spice to your day with a random curated quote or wallpaper.

## Basic Usage

```
$ npm install -g spice
$ spice invoke
```

## Providers

Spice pulls content from a number of different providers. Spice attempts to only pull new content rather than pulling the same content multiple times.

 - [apod](https://apod.nasa.gov/apod/astropix.html) -- Sets the desktop wallpaper to NASA's astronomy picture of the day.
 - [brainyquote](https://www.brainyquote.com/) -- Generates pop-up notifications with one of the quotes of the day.
 - [wikimedia](https://commons.wikimedia.org/wiki/Main_Page) -- Sets the desktop wallpaper to the Wikimedia Commons picture of the day.
 - [xkcd](https://xkcd.com/) -- Sets the desktop wallpaper to the current XKCD comic.
 
Normally the provider is selected at random based on what new content is available. However, a provider may be explicitly selected using the `--provider` option. For example:

```
$ spice invoke --provider xkcd
```

## More Randomness

In order to create a true sense of surprise and limit the amount of distraction, the `--probability` option can be used to cause spice to randomly no-op. This can be useful when running spice on a schedule. For example, adding the following to a user's crontab should cause spice to run on random schedule that averages roughly one real invocation every three hours:

```
*/5 * * * * spice invoke --probability 0.03
```
