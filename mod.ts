#!/usr/bin/env -S deno run --allow-run --allow-read --allow-write

const m4bFiles = Deno.args.filter((f) => f.toLowerCase().endsWith(".m4b"));

if (m4bFiles.length === 0) {
  console.error("Please provide some m4b files to process.");
  Deno.exit(1);
}

console.log("m4bFiles ", m4bFiles);

for (const file of m4bFiles) {
  await createAuthorDir(file);
}

async function createAuthorDir(filePath) {
  const rawMeta = await new Deno.Command("ffprobe", {
    args: [
      "-v",
      "quiet",
      "-print_format",
      "json",
      "-show_format",
      "-show_streams",
      "-i",
      filePath,
    ],
  }).output();

  const jsonMeta = JSON.parse(
    new TextDecoder().decode(rawMeta.stdout),
  );

  const author = jsonMeta.format.tags.artist.replace(".", " ");

  try {
    const { isFile, isDirectory } = await Deno.stat(author);

    if (!isFile && !isDirectory) {
      console(`${author} file or folder already exists!`);
    }
  } catch {
    await Deno.mkdir(author);
    console.log(`Created: ${author}`);
  }

  await Deno.rename(filePath, `${author}/${filePath}`);
}
