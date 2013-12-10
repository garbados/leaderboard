function (doc) {
  if (doc.type === 'item') {
    emit(doc.created_at, {
      title: doc.title
    });
  }
}