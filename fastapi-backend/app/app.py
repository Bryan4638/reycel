from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from telegram.error import TelegramError
import os
from dotenv import load_dotenv

from fastapi.middleware.cors import CORSMiddleware
from telegram import Bot, InlineKeyboardButton, InlineKeyboardMarkup
import asyncio
import uvicorn
import httpx


# Cargar variables de entorno
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FormData(BaseModel):
    transactionID: str
    productCount: int
    price: float
    fastDelivery: bool
    address: str
    town: str
    paymentID: str

async def send_message(message: str, transaction_id: str = None, payment_id: str = None):
    bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
    chat_id = os.getenv('TELEGRAM_CHAT_ID')
    
    if not bot_token or not chat_id:
        raise HTTPException(status_code=500, detail="Telegram credentials not configured")
    
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    
    # Create inline keyboard buttons if transaction details are provided
    keyboard = None
    if transaction_id and payment_id:
        keyboard = InlineKeyboardMarkup([
            [
                InlineKeyboardButton(
                    "Confirmar",
                    callback_data=f"confirm_{transaction_id}_{payment_id}"
                ),
                InlineKeyboardButton(
                    "Denegar",
                    callback_data=f"deny_{transaction_id}_{payment_id}"
                )
            ]
        ])
    
    payload = {
        "chat_id": chat_id,
        "text": message,
        "reply_markup": keyboard.to_dict() if keyboard else None
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            raise HTTPException(status_code=500, detail=f"Error sending message to Telegram: {str(e)} {e}")

@app.post("/send_message_bot")
async def submit_form(form_data: FormData):
    print(f"Received form data: {form_data}")
    try:
        message = f"""Se ha registrado una nueva transacción con los siguientes detalles:
    - ID de Transacción: {form_data.transactionID}
    - Cantidad de Productos: {form_data.productCount}
    - Precio Total: ${form_data.price:.2f}
    - Entrega Rápida: {'Si' if form_data.fastDelivery else 'No'}
    - Direccion: {form_data.address}
    - Poblado: {form_data.town}

    Por favor, confirma o deniega esta transacción."""
        
        await send_message(message, form_data.transactionID, form_data.paymentID)

        return {"success": True, "message": "Mensaje enviado correctamente"}
    except Exception as error:
        print(f"Error en submit_form: {error}")
        raise HTTPException(status_code=500, detail=str(error))

@app.get("/")
def read_root():
    return {
        "message": "API de envío de SMS a Telegram",
        "endpoints": {
            "POST /send-sms": "Envía mensaje con botones interactivos",
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)