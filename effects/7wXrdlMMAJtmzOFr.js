let value = Math.max(1, Number(this.effect.specifier) - 1);

this.effect.update({name: this.effect.setSpecifier(value)});

this.script.notification("Decreased to " + value);