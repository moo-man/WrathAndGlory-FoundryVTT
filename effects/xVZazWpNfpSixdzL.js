let value = Number(this.effect.specifier) + 1;
this.effect.update({name: this.effect.setSpecifier(value)})

this.script.notification("Increased to " + value);