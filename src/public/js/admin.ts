const deleteProduct = async (btn: HTMLButtonElement) => {
  const productId = (
    btn.parentNode?.querySelector("[name=productId") as HTMLInputElement
  )?.value;
  const csrfToken = (
    btn.parentNode?.querySelector("[name=_csrf") as HTMLInputElement
  )?.value;

  const productElementToDelete = btn.closest("article");

  const response = await fetch("/admin/product/" + productId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrfToken,
    },
  });
  console.log(response);
  productElementToDelete?.parentNode?.removeChild(productElementToDelete);
};
