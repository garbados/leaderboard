function (doc) {
  // TODO customize this function for your dataset
  if (doc.type === 'item') {
    emit(doc.created_at, {
      title: doc.title
    });
  }
}