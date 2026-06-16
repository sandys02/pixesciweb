const extensionAttributePatterns = [/^bis_/, /^__processed_[\w-]+__$/]

function removeExtensionAttributes() {
  const elements = [document.documentElement, ...document.documentElement.querySelectorAll("*")]

  for (const element of elements) {
    for (const attribute of Array.from(element.attributes)) {
      if (extensionAttributePatterns.some((pattern) => pattern.test(attribute.name))) {
        element.removeAttribute(attribute.name)
      }
    }
  }
}

try {
  removeExtensionAttributes()
} catch {
  // Extension cleanup should never block React hydration.
}
