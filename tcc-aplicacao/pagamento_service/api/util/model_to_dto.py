from typing import Type, get_origin, get_args, Union
from django.db.models import Model
from pydantic import BaseModel
from uuid import UUID

def unwrap_type(type_hint):
    """
    Desembrulha Optional / Union para pegar o tipo BaseModel real.
    """
    origin = get_origin(type_hint)
    if origin is Union:
        args = get_args(type_hint)
        for arg in args:
            if isinstance(arg, type) and issubclass(arg, BaseModel):
                return arg
    if isinstance(type_hint, type) and issubclass(type_hint, BaseModel):
        return type_hint
    return None

def model_to_dto(model_instance: Model, dto_class: Type[BaseModel]) -> BaseModel:
    data = {}

    for field_name, model_field in dto_class.model_fields.items():
        if not hasattr(model_instance, field_name):
            continue

        value = getattr(model_instance, field_name)

        # UUID
        if isinstance(value, UUID):
            data[field_name] = str(value)

        # Nested DTO (ForeignKey ou OneToOneField)
        elif isinstance(value, Model):
            nested_dto_class = unwrap_type(model_field.annotation)
            if nested_dto_class:
                data[field_name] = model_to_dto(value, nested_dto_class)
            else:
                data[field_name] = str(value)

        # ManyToManyField
        elif hasattr(value, "all"):
            nested_dto_class = unwrap_type(get_args(model_field.annotation)[0])
            if nested_dto_class:
                data[field_name] = [model_to_dto(v, nested_dto_class) for v in value.all()]
            else:
                data[field_name] = [str(v) for v in value.all()]

        # Campos normais
        else:
            data[field_name] = value

    return dto_class(**data)
