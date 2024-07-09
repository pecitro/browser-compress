// ファイルを選択するためのフォーム要素
const fileInput = document.getElementById("file-input");

// ファイルが選択されたときのイベントハンドラ
fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];

  // CompressionStreamを作成する
  // const compressionStream = new CompressionStream("gzip");
  const compressionStream = new CompressionStream("zstd");

  // FileReaderを使用してファイルを読み込む
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = async (e) => {
    const arraybuffer = e.target.result;
    const uint8Array = new Uint8Array(arraybuffer);

    const writer = compressionStream.writable.getWriter();
    writer.write(uint8Array);
    writer.close();

    const compressdData = await new Response(compressionStream.readable).arrayBuffer();

    // Blobオブジェクトを作成して、圧縮されたファイルを保存する
    const blob = new Blob([compressdData], { type: file.type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    // link.download = file.name + ".gz";  // 圧縮されたファイルの名前を設定する
    link.download = file.name + ".zst";  // 圧縮されたファイルの名前を設定する
    link.click();
  };
});